package com.fnd.virgo.service.impl;

import com.fnd.virgo.dto.MasterPassword2DTO;
import com.fnd.virgo.dto.MasterPasswordDTO;
import com.fnd.virgo.dto.WalletBasicDTO;
import com.fnd.virgo.entity.MasterPassword;
import com.fnd.virgo.entity.Wallet;
import com.fnd.virgo.enums.TypeEnum;
import com.fnd.virgo.repository.MasterPasswordRepository;
import com.fnd.virgo.repository.WalletRepository;
import com.fnd.virgo.service.MasterPasswordService;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class MasterPasswordServiceImpl implements MasterPasswordService {
    private final MasterPasswordRepository masterPasswordRepository;
    private final WalletRepository walletRepository;
    private final ModelMapper modelMapper;

    public MasterPasswordServiceImpl(MasterPasswordRepository masterPasswordRepository, WalletRepository walletRepository) {
        this.masterPasswordRepository = masterPasswordRepository;
        this.walletRepository = walletRepository;
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
    public MasterPasswordDTO update(@NotNull MasterPassword2DTO masterPassword2DTO, @NotNull JwtAuthenticationToken jwtAuthenticationToken) {
        String userId = jwtAuthenticationToken.getName();
        Optional<MasterPassword> optionalOldMasterPasswordDTO = this.masterPasswordRepository.findMasterPasswordByUserId(userId);

        if (optionalOldMasterPasswordDTO.isEmpty())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Object not found");

        MasterPassword masterPassword = optionalOldMasterPasswordDTO.get();
        List<WalletBasicDTO> walletBasicDTOList = masterPassword2DTO.getWalletBasicDTOList();

        if (masterPassword.getHashPasswd().equals(masterPassword2DTO.getHashPasswd()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Same password");

        if (walletBasicDTOList.stream().anyMatch(walletDTO -> Arrays.stream(TypeEnum.values()).noneMatch(typeEnum -> walletDTO.getType().equalsIgnoreCase(typeEnum.name()))))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Type not found");

        List<Wallet> walletList = walletBasicDTOList.stream().map(walletBasicDTO -> {
            Optional<Wallet> optionalWallet = walletRepository.findByIdAndUserId(walletBasicDTO.getId(), userId);

            if (optionalWallet.isEmpty())
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Objects not found");

            Wallet wallet = optionalWallet.get();
            String info = walletBasicDTO.getInfo();

            if (wallet.getType().equals(TypeEnum.CREDENTIAL.name()))
                wallet.setPasswd(info);
            else
                wallet.setContent(info);

            wallet.setIv(walletBasicDTO.getIv());
            wallet.setSalt(walletBasicDTO.getSalt());

            return wallet;
        }).toList();

        walletRepository.saveAll(walletList);

        masterPassword.setHashPasswd(masterPassword2DTO.getHashPasswd());
        masterPassword.setSalt(masterPassword2DTO.getSalt());
        masterPassword = masterPasswordRepository.save(masterPassword);

        return modelMapper.map(masterPassword, MasterPasswordDTO.class);
    }
}
