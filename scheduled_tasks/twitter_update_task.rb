class TwitterUpdateTask < Scheduler::SchedulerTask
  environments :all
  # environments :staging, :production
  
  every '2m'
  # other examples:
  # every '24h', :first_at => Chronic.parse('next midnight')
  # cron '* 4 * * *'  # cron style
  # in '30s'          # run once, 30 seconds from scheduler start/restart
  
  
  def run
    Story.fetch_from_twitter()
    # Your code here, eg: 
    # User.send_due_invoices!
  end
end