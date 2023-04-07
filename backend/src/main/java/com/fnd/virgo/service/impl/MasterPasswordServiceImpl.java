package com.fnd.virgo.service.impl;

import com.fnd.virgo.dto.MasterPasswordDTO;
import com.fnd.virgo.entity.MasterPassword;
import com.fnd.virgo.repository.MasterPasswordRepository;
import com.fnd.virgo.service.MasterPasswordService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

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
    public MasterPasswordDTO getByUserId(String userId) {
        Optional<MasterPassword> optionalMasterPassword = this.masterPasswordRepository.findMasterPasswordByUserId(userId);
        return optionalMasterPassword.map(masterPassword -> modelMapper.map(masterPassword, MasterPasswordDTO.class)).orElse(null);
    }
}
