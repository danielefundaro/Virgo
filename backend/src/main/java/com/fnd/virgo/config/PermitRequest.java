package com.fnd.virgo.config;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum PermitRequest {
    LOGIN("auth", "login"),
    REFRESH_TOKEN("auth", "token"),
    FORGOT_PASSWORD("users", "credential/restoration"),
    USER_SAVE("users", "");

    private final String controller;
    private final String request;

    @Override
    public String toString() {
        return String.format("/%s/%s", controller, request);
    }

    public final static String LOGIN_REQUEST = "/login";
    public final static String REFRESH_TOKEN_REQUEST = "/token";
    public final static String FORGOT_PASSWORD_REQUEST = "/credential/restoration";
    public final static String USER_SAVE_REQUEST = "/";
}
