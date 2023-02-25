package com.fnd.virgo.service;

import com.fnd.virgo.dto.CredentialDTO;
import com.fnd.virgo.entity.Credential;
import com.fnd.virgo.repository.CredentialRepository;

public interface CredentialService extends EncryptCommonService<Credential, CredentialDTO, CredentialRepository> {
}
