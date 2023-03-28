package com.fnd.virgo.service.impl;

import com.fnd.virgo.dto.CredentialDTO;
import com.fnd.virgo.entity.Credential;
import com.fnd.virgo.repository.AuditRepository;
import com.fnd.virgo.repository.CredentialRepository;
import com.fnd.virgo.repository.WorkspaceRepository;
import com.fnd.virgo.service.CredentialService;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Slf4j
public class CredentialServiceImpl extends EncryptCommonServiceImpl<Credential, CredentialDTO, CredentialRepository> implements CredentialService {
    private final CredentialRepository credentialRepository;

    public CredentialServiceImpl(CredentialRepository credentialRepository, WorkspaceRepository workspaceRepository, AuditRepository auditRepository) {
        super(workspaceRepository, auditRepository);
        this.credentialRepository = credentialRepository;
    }

    @Override
    public CredentialRepository getRepository() {
        return this.credentialRepository;
    }

    @Override
    public Class<CredentialDTO> getClassDTO() {
        return CredentialDTO.class;
    }

    @Override
    public Class<Credential> getClassEntity() {
        return Credential.class;
    }

    @Override
    public Credential findEntity(@NotNull CredentialDTO credentialDTO, String userId) {
        Optional<Credential> optionalCredential = credentialRepository.findCredentialByUserIdAndWebsiteAndUsername(userId, credentialDTO.getWebsite(), credentialDTO.getUsername());
        return optionalCredential.orElse(null);
    }

    @Override
    public Page<Credential> findAllByFilter(String value, String userId, PageRequest pageRequest) {
        return credentialRepository.findAllByUserIdAndFilter(userId, value, value, value, value, pageRequest);
    }
}
