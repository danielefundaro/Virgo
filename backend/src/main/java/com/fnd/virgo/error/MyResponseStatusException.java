package com.fnd.virgo.error;

import com.fnd.virgo.error.enums.ErrorCode;
import org.springframework.http.HttpStatusCode;
import org.springframework.web.server.ResponseStatusException;

public class MyResponseStatusException extends ResponseStatusException {
    public MyResponseStatusException(HttpStatusCode status, ErrorCode errorCode, String reason) {
        super(status, String.format("{\"code\":\"%s\", \"reason\":\"%s\"}", errorCode.getCode(), reason), null, null, null);
    }
}
