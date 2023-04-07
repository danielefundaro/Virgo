package com.fnd.virgo.service.impl;

import com.fnd.virgo.dto.CredentialDTO;
import com.fnd.virgo.dto.NoteDTO;
import com.fnd.virgo.dto.WalletDTO;
import com.fnd.virgo.entity.Wallet;
import com.fnd.virgo.enums.TypeEnum;
import com.fnd.virgo.repository.AuditRepository;
import com.fnd.virgo.repository.WalletRepository;
import com.fnd.virgo.service.CredentialService;
import com.fnd.virgo.service.NoteService;
import com.fnd.virgo.service.WalletService;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;

@Service
@Slf4j
public class WalletServiceImpl extends BasicServiceImpl<Wallet, WalletDTO, WalletRepository> implements WalletService {
    private final WalletRepository walletRepository;
    private final CredentialService credentialService;
    private final NoteService noteService;

    public WalletServiceImpl(WalletRepository walletRepository, AuditRepository auditRepository, CredentialService credentialService, NoteService noteService) {
        super(auditRepository);
        this.walletRepository = walletRepository;
        this.credentialService = credentialService;
        this.noteService = noteService;
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
    public WalletDTO getByIdAndType(Long id, @NotNull String type, JwtAuthenticationToken jwtAuthenticationToken) {
        if (Arrays.stream(TypeEnum.values()).noneMatch(typeEnum -> type.equalsIgnoreCase(typeEnum.name())))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Type not found");

        WalletDTO walletDTO;

        if (type.equalsIgnoreCase(TypeEnum.CREDENTIAL.name())) {
            walletDTO = modelMapper.map(credentialService.getById(id, jwtAuthenticationToken), WalletDTO.class);
        } else {
            walletDTO = modelMapper.map(noteService.getById(id, jwtAuthenticationToken), WalletDTO.class);
        }

        walletDTO.setType(type.toUpperCase());
        return walletDTO;
    }

    @Override
    public WalletDTO save(WalletDTO walletDTO, @NotNull String type, JwtAuthenticationToken jwtAuthenticationToken) {
        if (Arrays.stream(TypeEnum.values()).noneMatch(typeEnum -> type.equalsIgnoreCase(typeEnum.name())))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Type not found");

        if (type.equalsIgnoreCase(TypeEnum.CREDENTIAL.name())) {
            CredentialDTO credentialDTO = modelMapper.map(walletDTO, CredentialDTO.class);
            walletDTO = modelMapper.map(credentialService.save(credentialDTO, jwtAuthenticationToken), WalletDTO.class);
        } else {
            NoteDTO noteDTO = modelMapper.map(walletDTO, NoteDTO.class);
            walletDTO = modelMapper.map(noteService.save(noteDTO, jwtAuthenticationToken), WalletDTO.class);
        }

        walletDTO.setType(type.toUpperCase());
        return walletDTO;
    }

    @Override
    public WalletDTO update(WalletDTO walletDTO, @NotNull String type, JwtAuthenticationToken jwtAuthenticationToken) {
        if (Arrays.stream(TypeEnum.values()).noneMatch(typeEnum -> type.equalsIgnoreCase(typeEnum.name())))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Type not found");

        if (type.equalsIgnoreCase(TypeEnum.CREDENTIAL.name())) {
            CredentialDTO credentialDTO = modelMapper.map(walletDTO, CredentialDTO.class);
            walletDTO = modelMapper.map(credentialService.update(credentialDTO, jwtAuthenticationToken), WalletDTO.class);
        } else {
            NoteDTO noteDTO = modelMapper.map(walletDTO, NoteDTO.class);
            walletDTO = modelMapper.map(noteService.update(noteDTO, jwtAuthenticationToken), WalletDTO.class);
        }

        walletDTO.setType(type.toUpperCase());
        return walletDTO;
    }

    @Override
    public WalletDTO delete(Long id, @NotNull String type, JwtAuthenticationToken jwtAuthenticationToken) {
        if (Arrays.stream(TypeEnum.values()).noneMatch(typeEnum -> type.equalsIgnoreCase(typeEnum.name())))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Type not found");

        WalletDTO walletDTO;

        if (type.equalsIgnoreCase(TypeEnum.CREDENTIAL.name())) {
            walletDTO = modelMapper.map(credentialService.delete(id, jwtAuthenticationToken), WalletDTO.class);
        } else {
            walletDTO = modelMapper.map(noteService.delete(id, jwtAuthenticationToken), WalletDTO.class);
        }

        walletDTO.setType(type.toUpperCase());
        return walletDTO;
    }
}
