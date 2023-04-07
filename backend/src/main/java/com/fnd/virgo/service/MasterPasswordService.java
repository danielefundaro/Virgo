package com.fnd.virgo.service;

import com.fnd.virgo.dto.MasterPasswordDTO;

public interface MasterPasswordService {
    MasterPasswordDTO getByUserId(String userId);
}
