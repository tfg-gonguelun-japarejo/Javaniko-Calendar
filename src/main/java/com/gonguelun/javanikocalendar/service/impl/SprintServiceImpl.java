package com.gonguelun.javanikocalendar.service.impl;

import com.gonguelun.javanikocalendar.domain.Sprint;
import com.gonguelun.javanikocalendar.repository.SprintRepository;
import com.gonguelun.javanikocalendar.service.SprintService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Sprint}.
 */
@Service
@Transactional
public class SprintServiceImpl implements SprintService {

    private final Logger log = LoggerFactory.getLogger(SprintServiceImpl.class);

    private final SprintRepository sprintRepository;

    public SprintServiceImpl(SprintRepository sprintRepository) {
        this.sprintRepository = sprintRepository;
    }

    @Override
    public Sprint save(Sprint sprint) {
        log.debug("Request to save Sprint : {}", sprint);
        return sprintRepository.save(sprint);
    }

    @Override
    public Optional<Sprint> partialUpdate(Sprint sprint) {
        log.debug("Request to partially update Sprint : {}", sprint);

        return sprintRepository
            .findById(sprint.getId())
            .map(
                existingSprint -> {
                    if (sprint.getSprint() != null) {
                        existingSprint.setSprint(sprint.getSprint());
                    }
                    if (sprint.getStartDate() != null) {
                        existingSprint.setStartDate(sprint.getStartDate());
                    }
                    if (sprint.getEndDate() != null) {
                        existingSprint.setEndDate(sprint.getEndDate());
                    }
                    if (sprint.getStatus() != null) {
                        existingSprint.setStatus(sprint.getStatus());
                    }
                    if (sprint.getGoal() != null) {
                        existingSprint.setGoal(sprint.getGoal());
                    }

                    return existingSprint;
                }
            )
            .map(sprintRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Sprint> findAll() {
        log.debug("Request to get all Sprints");
        return sprintRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Sprint> findOne(Long id) {
        log.debug("Request to get Sprint : {}", id);
        return sprintRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Sprint : {}", id);
        sprintRepository.deleteById(id);
    }
}
