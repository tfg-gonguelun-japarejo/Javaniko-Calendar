package com.gonguelun.javanikocalendar.service;

import com.gonguelun.javanikocalendar.domain.Calendar;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Calendar}.
 */
public interface CalendarService {
    /**
     * Save a calendar.
     *
     * @param calendar the entity to save.
     * @return the persisted entity.
     */
    Calendar save(Calendar calendar);

    /**
     * Partially updates a calendar.
     *
     * @param calendar the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Calendar> partialUpdate(Calendar calendar);

    /**
     * Get all the calendars.
     *
     * @return the list of entities.
     */
    List<Calendar> findAll();

    /**
     * Get the "id" calendar.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Calendar> findOne(Long id);

    /**
     * Delete the "id" calendar.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
