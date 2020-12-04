package com.ifocus.aaascloud.api.common.constant;

public class HttpCommons {
	public final static int SUCCESS = 200;

    public final static String GET = "GET";

    public final static String POST = "POST";

    public final static String DELETE = "DELETE";

    public final static String PUT = "PUT";

    public final static String APPLICATION_JSON = "application/json;charset=UTF-8";

    public final static String UTF_8 = "UTF-8";

    public final static String REQUEST_TYPE = "request_type";

    public final static String REQUEST_URL = "request_url";

    public final static String STUB_FILE = "stub_file";

    public final static String STUB_SWITCH_ON = "stub.switch.on";

    public enum Response {
        SUCCESS(200, "success"),
        UNKNOWN_ERROR(5000, "facade error"),
        BIZ_ERROR(5001, "business error");

        private int code;
        private String message;

        Response(int code, String message) {
            this.code = code;
            this.message = message;
        }

        public int getCode() {
            return code;
        }

        public String getMessage() {
            return message;
        }
    }
}
