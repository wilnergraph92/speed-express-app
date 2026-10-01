-- =============================================================================
-- Speed Express Shipping — mise à jour : notifications sur téléphone
-- -----------------------------------------------------------------------------
-- Tout sélectionner, copier, coller dans Supabase > SQL Editor, puis Run.
--
-- AVANT DE LANCER : vérifiez en haut de la page que le projet ouvert est bien
-- « speed-express-site ». Ce script ne doit jamais être passé sur la base de
-- Goship Express : les deux entreprises ont leurs propres données.
--
-- Ce qu'elle ajoute :
--   · la table « appareils » : quels téléphones appartiennent à quel client ;
--   · un déclencheur qui, à chaque changement de statut d'un colis, envoie
--     une notification aux téléphones du client concerné.
--
-- Le message part dans la langue du client (clients.langue), avec le même
-- vocabulaire que le site et l'application.
--
-- Rejouable sans risque : rien n'est supprimé, et la passer deux fois ne
-- change rien.
-- =============================================================================


-- 1. De quoi appeler un service extérieur depuis la base --------------------
--    pg_net envoie la requête sans faire attendre l'enregistrement du colis :
--    si le service de notification est lent, l'équipe ne le sent pas.
create extension if not exists pg_net with schema extensions;


-- 2. Les appareils d'un client ----------------------------------------------
create table if not exists public.appareils (
  jeton       text primary key,
  client_id   uuid not null references public.clients (id) on delete cascade,
  plateforme  text,
  vu_le       timestamptz not null default now(),
  cree_le     timestamptz not null default now()
);

comment on table public.appareils is
  'Un téléphone par ligne. Le jeton vient d''Expo et change à la réinstallation : un client peut avoir plusieurs appareils.';

create index if not exists appareils_client_idx on public.appareils (client_id);

alter table public.appareils enable row level security;

-- Un client ne voit et ne touche que ses propres appareils.
drop policy if exists appareils_lecture on public.appareils;
create policy appareils_lecture on public.appareils
  for select to authenticated
  using (client_id = (select auth.uid()));

drop policy if exists appareils_ajout on public.appareils;
create policy appareils_ajout on public.appareils
  for insert to authenticated
  with check (client_id = (select auth.uid()));

drop policy if exists appareils_modification on public.appareils;
create policy appareils_modification on public.appareils
  for update to authenticated
  using (client_id = (select auth.uid()))
  with check (client_id = (select auth.uid()));

drop policy if exists appareils_suppression on public.appareils;
create policy appareils_suppression on public.appareils
  for delete to authenticated
  using (client_id = (select auth.uid()));


-- 3. Le texte de la notification, dans la langue du client -------------------
create or replace function public.texte_notification(p_statut text, p_langue text)
returns text
language sql
immutable
set search_path = ''
as $$
  select case coalesce(p_langue, 'fr')
    when 'en' then case p_statut
      when 'confirme'   then 'Package confirmed'
      when 'expedie'    then 'Package shipped'
      when 'disponible' then 'Your package is available'
      when 'livre'      then 'Package delivered'
      else 'Action required on your package' end
    when 'es' then case p_statut
      when 'confirme'   then 'Paquete confirmado'
      when 'expedie'    then 'Paquete enviado'
      when 'disponible' then 'Su paquete está disponible'
      when 'livre'      then 'Paquete entregado'
      else 'Acción requerida en su paquete' end
    when 'ht' then case p_statut
      when 'confirme'   then 'Kolis konfime'
      when 'expedie'    then 'Kolis voye'
      when 'disponible' then 'Kolis ou a disponib'
      when 'livre'      then 'Kolis livre'
      else 'Gen yon aksyon pou kolis ou a' end
    else case p_statut
      when 'confirme'   then 'Colis confirmé'
      when 'expedie'    then 'Colis expédié'
      when 'disponible' then 'Votre colis est disponible'
      when 'livre'      then 'Colis livré'
      else 'Action requise sur votre colis' end
  end;
$$;


-- 4. Le déclencheur -----------------------------------------------------------
--    Il ne part que si le statut a réellement changé : corriger une faute de
--    frappe dans une description ne doit réveiller personne.
create or replace function public.prevenir_client()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_langue   text;
  v_titre    text;
  v_jetons   text[];
begin
  if tg_op = 'UPDATE' and new.statut is not distinct from old.statut then
    return new;
  end if;

  select coalesce(c.langue, 'fr') into v_langue
  from public.clients c where c.id = new.client_id;

  select array_agg(a.jeton) into v_jetons
  from public.appareils a where a.client_id = new.client_id;

  if v_jetons is null or array_length(v_jetons, 1) is null then
    return new;   -- ce client n'a pas d'application installée
  end if;

  v_titre := public.texte_notification(new.statut, v_langue);

  perform extensions.net.http_post(
    url     := 'https://exp.host/--/api/v2/push/send',
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body    := jsonb_build_object(
      'to',    to_jsonb(v_jetons),
      'title', v_titre,
      'body',  new.numero,
      'sound', 'default',
      'channelId', 'colis',
      'data',  jsonb_build_object('colis_id', new.id, 'numero', new.numero)
    )
  );

  return new;
end;
$$;

drop trigger if exists prevenir_client on public.colis;
create trigger prevenir_client
  after insert or update of statut on public.colis
  for each row execute function public.prevenir_client();

comment on function public.prevenir_client is
  'Envoie une notification aux téléphones du client quand le statut de son colis change. Silencieux si le client n''a pas l''application.';
