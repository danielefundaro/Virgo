package com.fnd.virgo.error.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    MASTER_PASSWORD_MISSING("001"),
    TOKEN_EXPIRED("002");

    private final String code;
}
