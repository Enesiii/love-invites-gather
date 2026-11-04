CREATE OR REPLACE FUNCTION public.delete_admin_payment_order(p_id uuid)
RETURNS boolean LANGUAGE plpgsql SET search_path = public AS $$
DECLARE v_invitation_id uuid;
BEGIN
  SELECT invitation_id INTO v_invitation_id FROM public.payment_orders WHERE id = p_id FOR UPDATE;
  IF NOT FOUND THEN RETURN false; END IF;
  UPDATE public.invitations SET activated_at = NULL WHERE id = v_invitation_id;
  DELETE FROM public.payment_orders WHERE id = p_id;
  RETURN true;
END;
$$;
REVOKE ALL ON FUNCTION public.delete_admin_payment_order(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.delete_admin_payment_order(uuid) TO service_role;

CREATE OR REPLACE FUNCTION public.delete_admin_reminder_subscription(p_notification_id uuid)
RETURNS boolean LANGUAGE plpgsql SET search_path = public AS $$
DECLARE v_subscription_id uuid; v_rsvp_id uuid;
BEGIN
  SELECT subscription_id INTO v_subscription_id FROM public.reminder_notifications WHERE id = p_notification_id FOR UPDATE;
  IF NOT FOUND THEN RETURN false; END IF;
  SELECT rsvp_id INTO v_rsvp_id FROM public.push_subscriptions WHERE id = v_subscription_id FOR UPDATE;
  UPDATE public.rsvps SET push_status = 'declined' WHERE id = v_rsvp_id;
  DELETE FROM public.push_subscriptions WHERE id = v_subscription_id;
  RETURN true;
END;
$$;
REVOKE ALL ON FUNCTION public.delete_admin_reminder_subscription(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.delete_admin_reminder_subscription(uuid) TO service_role;