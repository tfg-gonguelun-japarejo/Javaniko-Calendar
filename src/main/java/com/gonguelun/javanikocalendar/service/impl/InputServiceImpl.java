package com.gonguelun.javanikocalendar.service.impl;

import com.gonguelun.javanikocalendar.domain.Input;
import com.gonguelun.javanikocalendar.repository.InputRepository;
import com.gonguelun.javanikocalendar.service.InputService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Input}.
 */
@Service
@Transactional
public class InputServiceImpl implements InputService {

    private final Logger log = LoggerFactory.getLogger(InputServiceImpl.class);

    private final InputRepository inputRepository;

    public InputServiceImpl(InputRepository inputRepository) {
        this.inputRepository = inputRepository;
    }

    @Override
    public Input save(Input input) {
        log.debug("Request to save Input : {}", input);
        return inputRepository.save(input);
    }

    @Override
    public Optional<Input> partialUpdate(Input input) {
        log.debug("Request to partially update Input : {}", input);

        return inputRepository
            .findById(input.getId())
            .map(
                existingInput -> {
                    if (input.getComment() != null) {
                        existingInput.setComment(input.getComment());
                    }
                    if (input.getFeelings() != null) {
                        existingInput.setFeelings(input.getFeelings());
                    }
                    if (input.getInputDate() != null) {
                        existingInput.setInputDate(input.getInputDate());
                    }

                    return existingInput;
                }
            )
            .map(inputRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Input> findAll() {
        log.debug("Request to get all Inputs");
        return inputRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Input> findOne(Long id) {
        log.debug("Request to get Input : {}", id);
        return inputRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Input : {}", id);
        inputRepository.deleteById(id);
    }
}
