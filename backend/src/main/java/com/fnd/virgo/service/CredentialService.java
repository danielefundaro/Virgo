package com.fnd.virgo.service;

import com.fnd.virgo.dto.CredentialDetailsDTO;

import java.util.List;

public interface CredentialService {
    List<CredentialDetailsDTO> getAll();

    CredentialDetailsDTO save(CredentialDetailsDTO credentialDetailsDTO);

    CredentialDetailsDTO update(CredentialDetailsDTO credentialDetailsDTO);

    CredentialDetailsDTO delete(CredentialDetailsDTO credentialDetailsDTO);
}
