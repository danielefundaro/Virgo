package com.fnd.virgo.service.impl;

import com.fnd.virgo.dto.CredentialDTO;
import com.fnd.virgo.entity.Credential;
import com.fnd.virgo.model.UpdateRequest;
import com.fnd.virgo.repository.AuditRepository;
import com.fnd.virgo.repository.CredentialRepository;
import com.fnd.virgo.repository.WorkspaceRepository;
import com.fnd.virgo.service.CredentialService;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Slf4j
public class CredentialServiceImpl extends EncryptCommonServiceImpl<Credential, CredentialDTO, CredentialRepository> implements CredentialService {
    private final CredentialRepository credentialRepository;

    @Autowired
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
    public CredentialDTO update(@NotNull UpdateRequest<CredentialDTO> updateRequest) {
        String userId = "a";
        CredentialDTO savedCredentialDTO = super.update(updateRequest);
        Credential credential = findEntity(savedCredentialDTO, userId);

        credential.setUsername(updateRequest.getNewInfo().getUsername());
        credential.setPasswd(updateRequest.getNewInfo().getPasswd());
        credential.setWebsite(updateRequest.getNewInfo().getWebsite());
        credential = credentialRepository.save(credential);

        return modelMapper.map(credential, getClassDTO());
    }
}
