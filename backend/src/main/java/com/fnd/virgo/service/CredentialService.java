package com.fnd.virgo.service;

import com.fnd.virgo.dto.CredentialDTO;

import java.util.List;

public interface CredentialService {
    List<CredentialDTO> getAll();

    CredentialDTO save(CredentialDTO credentialDTO);

    CredentialDTO update(CredentialDTO credentialDTO);

    CredentialDTO delete(CredentialDTO credentialDTO);
}
