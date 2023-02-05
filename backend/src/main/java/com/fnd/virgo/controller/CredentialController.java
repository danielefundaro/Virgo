package com.fnd.virgo.controller;

import com.fnd.virgo.dto.CredentialDTO;
import com.fnd.virgo.service.CredentialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "credentials")
@Validated
public class CredentialController {
    private final CredentialService credentialService;

    @Autowired
    public CredentialController(CredentialService credentialService) {
        this.credentialService = credentialService;
    }

    @GetMapping(value = "/", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(code = HttpStatus.OK)
    private List<CredentialDTO> getAll() {
        return credentialService.getAll();
    }

    @PostMapping(value = "/", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(code = HttpStatus.CREATED)
    private CredentialDTO save(@RequestBody CredentialDTO credentialDTO) {
        return credentialService.save(credentialDTO);
    }

    @PutMapping(value = "/", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(code = HttpStatus.OK)
    private CredentialDTO update(@RequestBody CredentialDTO credentialDTO) {
        return credentialService.update(credentialDTO);
    }

    @DeleteMapping(value = "/", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(code = HttpStatus.OK)
    private CredentialDTO delete(@RequestBody CredentialDTO credentialDTO) {
        return credentialService.delete(credentialDTO);
    }
}
