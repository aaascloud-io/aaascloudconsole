package com.ifocus.aaascloud.model;

import lombok.Getter;
import lombok.Setter;

public class DisplayItem {

	@Getter
	@Setter
	private Integer displayOrder;

	@Getter
	@Setter
	private String titleItemName;

	@Getter
	@Setter
	private String titleDisplayName;

	public DisplayItem(Integer displayOrder, String titleItemName, String titleDisplayName) {
		this.displayOrder = displayOrder;
		this.titleItemName = titleItemName;
		this.titleDisplayName = titleDisplayName;
	}
}
