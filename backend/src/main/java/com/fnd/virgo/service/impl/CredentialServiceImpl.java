package com.fnd.virgo.service.impl;

import com.fnd.virgo.dto.CredentialDTO;
import com.fnd.virgo.entity.Audit;
import com.fnd.virgo.entity.AuditTuple;
import com.fnd.virgo.entity.CommonFields;
import com.fnd.virgo.entity.Credential;
import com.fnd.virgo.enums.AuditTypeEnum;
import com.fnd.virgo.repository.AuditRepository;
import com.fnd.virgo.repository.CredentialRepository;
import com.fnd.virgo.service.CredentialService;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class CredentialServiceImpl implements CredentialService {
    private final AuditRepository auditRepository;
    private final CredentialRepository credentialRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public CredentialServiceImpl(CredentialRepository credentialRepository,
                                 AuditRepository auditRepository) {
        this.credentialRepository = credentialRepository;
        this.modelMapper = new ModelMapper();
        this.auditRepository = auditRepository;
    }

    @Override
    public List<CredentialDTO> getAll() {
        String userId = "a";
        List<Credential> credentials = credentialRepository.findAll();

        // Save the audit info into db
        String info = String.format("The user %s got all the credentials. Count %s", userId, credentials.size());
        saveAuditInfo(credentials.stream().map(CommonFields::getId).collect(Collectors.toList()), userId, AuditTypeEnum.SELECT_ALL, info, true);

        return credentials.stream().map(credential -> modelMapper.map(credential, CredentialDTO.class)).collect(Collectors.toList());
    }

    @Override
    public CredentialDTO save(@NotNull CredentialDTO credentialDTO) {
        String userId = "a";
        Credential credential = getCredential(credentialDTO, userId);

        if (credential != null) {
            String error = String.format("The user %s found the credential while saving website: %s, username: %s", userId, credentialDTO.getWebsite(), credentialDTO.getUsername());
            saveAuditInfo(Collections.singletonList(credential.getId()), userId, error);
            log.error(error);

            throw new ResponseStatusException(HttpStatus.CONFLICT, "Object already exists");
        }

        credential = modelMapper.map(credentialDTO, Credential.class);
        credential.setUserId(userId);
        credential = credentialRepository.save(credential);

        // Save the audit info into db
        String info = String.format("The user %s saved a new credential with id %s", userId, credential.getId());
        saveAuditInfo(Collections.singletonList(credential.getId()), userId, AuditTypeEnum.INSERT, info, true);

        return modelMapper.map(credential, CredentialDTO.class);
    }

    @Override
    public CredentialDTO update(CredentialDTO credentialDTO) {
        String userId = "a";
        Credential credential = getCredential(credentialDTO, userId);

        if (credential == null) {
            String error = String.format("The user %s didn't find the credential while updating website: %s, username: %s", userId, credentialDTO.getWebsite(), credentialDTO.getUsername());
            saveAuditInfo(userId, error);
            log.error(error);

            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Object not found");
        }

        credential.setName(credentialDTO.getName());
        credential.setWebsite(credentialDTO.getWebsite());
        credential.setUsername(credentialDTO.getUsername());
        credential.setEncryptPassword(credentialDTO.getEncryptPassword());
        credential.setSalt(credentialDTO.getSalt());
        credential = credentialRepository.save(credential);

        // Save the audit info into db
        String info = String.format("The user %s updated the credential with id %s", userId, credential.getId());
        saveAuditInfo(Collections.singletonList(credential.getId()), userId, AuditTypeEnum.UPDATE, info, true);

        return modelMapper.map(credential, CredentialDTO.class);
    }

    @Override
    public CredentialDTO delete(CredentialDTO credentialDTO) {
        String userId = "a";
        Credential credential = getCredential(credentialDTO, userId);

        if (credential == null) {
            String error = String.format("The user %s didn't find the credential while deleting website: %s, username: %s", userId, credentialDTO.getWebsite(), credentialDTO.getUsername());
            saveAuditInfo(userId, error);
            log.error(error);

            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Object not found");
        }

        credential.setDeleted(true);
        credential = credentialRepository.save(credential);

        // Save the audit info into db
        String info = String.format("The user %s deleted the credential with id %s", userId, credential.getId());
        saveAuditInfo(Collections.singletonList(credential.getId()), userId, AuditTypeEnum.DELETE, info, true);

        return modelMapper.map(credential, CredentialDTO.class);
    }

    private Credential getCredential(@NotNull CredentialDTO credentialDTO, String userId) {
        Optional<Credential> optionalCredential = credentialRepository.findCredentialByUserIdAndWebsiteAndUsername(userId, credentialDTO.getWebsite(), credentialDTO.getUsername());
        return optionalCredential.orElse(null);
    }

    private void saveAuditInfo(String userId, String description) {
        saveAuditInfo(null, userId, description);
    }

    private void saveAuditInfo(List<Long> ids, String userId, String description) {
        saveAuditInfo(ids, userId, AuditTypeEnum.ERROR, description, false);
    }

    private void saveAuditInfo(List<Long> ids, String userId, AuditTypeEnum auditTypeEnum, String description, boolean showLog) {
        Audit audit = new Audit();
        Date now = new Date();

        audit.setDate(now);
        audit.setUserId(userId);
        audit.setType(auditTypeEnum);
        audit.setTableName(Credential.class.getSimpleName());
        audit.setDescription(description);

        if (ids != null) {
            audit.setTuples(ids.stream().map(id -> {
                AuditTuple auditTuple = new AuditTuple();

                auditTuple.setDate(now);
                auditTuple.setAudit(audit);
                auditTuple.setTupleId(id);

                return auditTuple;
            }).collect(Collectors.toList()));
        }

        auditRepository.save(audit);

        if (showLog)
            log.info(description);
    }
}
