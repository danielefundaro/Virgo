package com.fnd.virgo.service;

import com.fnd.virgo.dto.WalletDTO;
import com.fnd.virgo.entity.Wallet;
import com.fnd.virgo.repository.WalletRepository;
import org.jetbrains.annotations.NotNull;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.List;

public interface WalletService extends BasicService<Wallet, WalletDTO, WalletRepository> {
    WalletDTO getById(Long id, @NotNull JwtAuthenticationToken jwtAuthenticationToken);

    WalletDTO save(@NotNull WalletDTO walletDTO, JwtAuthenticationToken jwtAuthenticationToken);

    WalletDTO update(@NotNull WalletDTO walletDTO, JwtAuthenticationToken jwtAuthenticationToken);

    List<WalletDTO> updateAll(@NotNull List<WalletDTO> walletDTOList, @NotNull JwtAuthenticationToken jwtAuthenticationToken);

    WalletDTO delete(Long id, @NotNull JwtAuthenticationToken jwtAuthenticationToken);
}
