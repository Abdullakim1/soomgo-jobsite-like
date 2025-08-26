-- Function to create a notification when a new job application is submitted
CREATE OR REPLACE FUNCTION public.handle_new_job_application()
RETURNS TRIGGER AS $$
DECLARE
  company_user_id UUID;
  job_title TEXT;
BEGIN
  -- Get the user_id of the company that posted the job
  SELECT company_id, title INTO company_user_id, job_title FROM public.jobs WHERE id = NEW.job_id;

  -- Insert a notification for the company
  INSERT INTO public.notifications (user_id, message, link)
  VALUES (company_user_id, 'You have a new applicant for "' || job_title || '"', '/jobs/' || NEW.job_id || '/applicants');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function after a new job application is inserted
CREATE TRIGGER on_new_job_application
  AFTER INSERT ON public.job_applications
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_job_application();

-- Function to create a notification when a job application status is updated
CREATE OR REPLACE FUNCTION public.handle_application_status_update()
RETURNS TRIGGER AS $$
DECLARE
  job_title TEXT;
BEGIN
  -- Check if the status has changed
  IF NEW.status <> OLD.status AND NEW.status IN ('accepted', 'rejected') THEN
    -- Get the job title
    SELECT title INTO job_title FROM public.jobs WHERE id = NEW.job_id;

    -- Insert a notification for the instructor
    INSERT INTO public.notifications (user_id, message, link)
    VALUES (NEW.instructor_id, 'Your application for "' || job_title || '" has been ' || NEW.status, '/dashboard');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function after a job application is updated
CREATE TRIGGER on_application_status_update
  AFTER UPDATE ON public.job_applications
  FOR EACH ROW EXECUTE FUNCTION public.handle_application_status_update();
