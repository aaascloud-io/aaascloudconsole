package jp.co.ifocus.commons.log;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.pattern.ClassicConverter;
import ch.qos.logback.classic.spi.ILoggingEvent;

public class MessageIdConverter extends ClassicConverter {

	@Override
	public String convert(ILoggingEvent event) {
		Level level = event.getLevel();
		if (level.equals(Level.INFO) || level.equals(Level.WARN) || level.equals(Level.ERROR)) {
			return getMessageId(level, event.getMessage());
		}
		return null;
	}

	private String getMessageId(Level level, String message) {
		String messageId = MessageIdConstants.meesageIdsMap.get(message);
		if (messageId == null) {
			// placeholder for unknow message id
			if (level.equals(Level.INFO)) {
				return "I00000";
			}else if (level.equals(Level.WARN)) {
				return "W00000";
			}else {
				return "E00000"; 
			}
		}
		return messageId;
	}

}
