package com.fnd.virgo.service.impl;

import com.fnd.virgo.dto.MasterPasswordDTO;
import com.fnd.virgo.entity.MasterPassword;
import com.fnd.virgo.repository.MasterPasswordRepository;
import com.fnd.virgo.service.MasterPasswordService;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
@Slf4j
public class MasterPasswordServiceImpl implements MasterPasswordService {
    private final MasterPasswordRepository masterPasswordRepository;
    private final ModelMapper modelMapper;

    public MasterPasswordServiceImpl(MasterPasswordRepository masterPasswordRepository) {
        this.masterPasswordRepository = masterPasswordRepository;
        this.modelMapper = new ModelMapper();
    }

    @Override
    public MasterPasswordDTO get(@NotNull JwtAuthenticationToken jwtAuthenticationToken) {
        return getByUserId(jwtAuthenticationToken.getName());
    }

    @Override
    public MasterPasswordDTO getByUserId(String userId) {
        Optional<MasterPassword> optionalMasterPassword = this.masterPasswordRepository.findMasterPasswordByUserId(userId);
        return optionalMasterPassword.map(masterPassword -> modelMapper.map(masterPassword, MasterPasswordDTO.class)).orElse(null);
    }

    @Override
    public MasterPasswordDTO save(MasterPasswordDTO masterPasswordDTO, @NotNull JwtAuthenticationToken jwtAuthenticationToken) {
        String userId = jwtAuthenticationToken.getName();
        MasterPasswordDTO masterPasswordDTO1 = getByUserId(userId);

        if (masterPasswordDTO1 != null)
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Object already exists");

        MasterPassword masterPassword = modelMapper.map(masterPasswordDTO, MasterPassword.class);

        masterPassword.setUserId(userId);
        masterPassword = masterPasswordRepository.save(masterPassword);

        return modelMapper.map(masterPassword, MasterPasswordDTO.class);
    }

    @Override
    public MasterPasswordDTO update(@NotNull MasterPasswordDTO masterPasswordDTO, @NotNull JwtAuthenticationToken jwtAuthenticationToken) {
        String userId = jwtAuthenticationToken.getName();
        Optional<MasterPassword> optionalOldMasterPasswordDTO = this.masterPasswordRepository.findMasterPasswordByUserId(userId);

        if (optionalOldMasterPasswordDTO.isEmpty())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Object not found");

        MasterPassword masterPassword = optionalOldMasterPasswordDTO.get();

        if (masterPassword.getHashPasswd().equals(masterPasswordDTO.getHashPasswd()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Same password");

        masterPassword.setHashPasswd(masterPasswordDTO.getHashPasswd());
        masterPassword.setSalt(masterPasswordDTO.getSalt());
        masterPassword = masterPasswordRepository.save(masterPassword);

        return modelMapper.map(masterPassword, MasterPasswordDTO.class);
    }
}
