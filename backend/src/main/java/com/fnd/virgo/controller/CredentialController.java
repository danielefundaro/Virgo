package com.fnd.virgo.controller;

import com.fnd.virgo.dto.CredentialDTO;
import com.fnd.virgo.entity.Credential;
import com.fnd.virgo.repository.CredentialRepository;
import com.fnd.virgo.service.CredentialService;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "credentials")
@Validated
public class CredentialController implements CommonController<Credential, CredentialDTO, CredentialRepository, CredentialService> {
    private final CredentialService credentialService;

    public CredentialController(CredentialService credentialService) {
        this.credentialService = credentialService;
    }

    @Override
    public CredentialService getService() {
        return this.credentialService;
    }
}
