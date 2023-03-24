package com.fnd.virgo.service.impl;

import com.fnd.virgo.dto.WalletDTO;
import com.fnd.virgo.entity.Wallet;
import com.fnd.virgo.enums.AuditTypeEnum;
import com.fnd.virgo.repository.AuditRepository;
import com.fnd.virgo.repository.WalletRepository;
import com.fnd.virgo.service.WalletService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
@Slf4j
public class WalletServiceImpl extends BasicServiceImpl<Wallet, WalletDTO, WalletRepository> implements WalletService {
    private final WalletRepository walletRepository;

    public WalletServiceImpl(WalletRepository walletRepository, AuditRepository auditRepository) {
        super(auditRepository);
        this.walletRepository = walletRepository;
    }

    @Override
    public WalletRepository getRepository() {
        return this.walletRepository;
    }

    @Override
    public Class<WalletDTO> getClassDTO() {
        return WalletDTO.class;
    }

    @Override
    public Class<Wallet> getClassEntity() {
        return Wallet.class;
    }

    @Override
    public Page<Wallet> findAllByFilter(String value, String userId, PageRequest pageRequest) {
        return walletRepository.findAllByUserIdAndFilter(userId, value, value, value, value, pageRequest);
    }

    @Override
    public WalletDTO getByIdAndType(Long id, String type, JwtAuthenticationToken jwtAuthenticationToken) {
        String userId = jwtAuthenticationToken.getName();
        Optional<Wallet> optionalWallet = walletRepository.findByIdAndUserIdAndType(id, userId, type);

        if (optionalWallet.isEmpty()) {
            String error = String.format("The user %s didn't find the %s (type %s) while searching it with id %s", userId, getClassEntity().getSimpleName(), type, id);
            saveAuditInfo(userId, error);

            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Object not found");
        }

        Wallet wallet = optionalWallet.get();
        String info = String.format("The user %s got the %s with id %s", userId, getClassEntity().getSimpleName(), id);
        saveAuditInfo(wallet.getId(), userId, AuditTypeEnum.SELECT, info);

        return super.modelMapper.map(wallet, getClassDTO());
    }
}
