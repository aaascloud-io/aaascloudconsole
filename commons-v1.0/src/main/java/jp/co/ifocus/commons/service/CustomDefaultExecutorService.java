package jp.co.ifocus.commons.service;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.SynchronousQueue;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicLong;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jp.co.ifocus.commons.model.TaskWithImei;

public class CustomDefaultExecutorService {
	
	private Logger LOG = LoggerFactory.getLogger(getClass());

    private ExecutorService executorService;

    public CustomDefaultExecutorService(String threadNamePrefix) {
    	this.executorService = new ThreadPoolExecutor(1, 1000, /* アイドル時も1つのスレッドを常駐する */ 
                30L, TimeUnit.MINUTES,
                new SynchronousQueue<Runnable>(),
                new ThreadFactory() {
			
					private final AtomicLong counter = new AtomicLong();
					
					@Override
					public Thread newThread(Runnable r) {
						final Thread thread = Executors.defaultThreadFactory().newThread(r);
				        thread.setName(String.format(threadNamePrefix, counter.getAndIncrement()));
				        LOG.debug("New thread={} created.", thread.getName());
				        return thread;
					}
			
				});
    }

    public void execute(TaskWithImei<?> task) {
    	this.executorService.execute(task);
    }

}
