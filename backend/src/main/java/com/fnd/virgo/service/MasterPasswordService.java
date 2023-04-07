package com.fnd.virgo.service;

import com.fnd.virgo.dto.MasterPasswordDTO;
import org.jetbrains.annotations.NotNull;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

public interface MasterPasswordService {
    MasterPasswordDTO get(JwtAuthenticationToken jwtAuthenticationToken);

    MasterPasswordDTO getByUserId(String userId);

    MasterPasswordDTO save(MasterPasswordDTO masterPasswordDTO, @NotNull JwtAuthenticationToken jwtAuthenticationToken);

    MasterPasswordDTO update(@NotNull MasterPasswordDTO masterPasswordDTO, @NotNull JwtAuthenticationToken jwtAuthenticationToken);
}
