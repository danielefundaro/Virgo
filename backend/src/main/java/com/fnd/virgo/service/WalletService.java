package com.fnd.virgo.service;

import com.fnd.virgo.dto.WalletDTO;
import com.fnd.virgo.entity.Wallet;
import com.fnd.virgo.repository.WalletRepository;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

public interface WalletService extends BasicService<Wallet, WalletDTO, WalletRepository> {
    WalletDTO getByIdAndType(Long id, String type, JwtAuthenticationToken jwtAuthenticationToken);
}
