package com.gonguelun.javanikocalendar.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Calendar.
 */
@Entity
@Table(name = "calendar")
public class Calendar implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "holidays")
    private Integer holidays;

    @OneToMany(mappedBy = "calendar")
    @JsonIgnoreProperties(value = { "usuario", "calendar" }, allowSetters = true)
    private Set<Input> inputs = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "calendars", "proyect" }, allowSetters = true)
    private Sprint sprint;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Calendar id(Long id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public Calendar name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getHolidays() {
        return this.holidays;
    }

    public Calendar holidays(Integer holidays) {
        this.holidays = holidays;
        return this;
    }

    public void setHolidays(Integer holidays) {
        this.holidays = holidays;
    }

    public Set<Input> getInputs() {
        return this.inputs;
    }

    public Calendar inputs(Set<Input> inputs) {
        this.setInputs(inputs);
        return this;
    }

    public Calendar addInput(Input input) {
        this.inputs.add(input);
        input.setCalendar(this);
        return this;
    }

    public Calendar removeInput(Input input) {
        this.inputs.remove(input);
        input.setCalendar(null);
        return this;
    }

    public void setInputs(Set<Input> inputs) {
        if (this.inputs != null) {
            this.inputs.forEach(i -> i.setCalendar(null));
        }
        if (inputs != null) {
            inputs.forEach(i -> i.setCalendar(this));
        }
        this.inputs = inputs;
    }

    public Sprint getSprint() {
        return this.sprint;
    }

    public Calendar sprint(Sprint sprint) {
        this.setSprint(sprint);
        return this;
    }

    public void setSprint(Sprint sprint) {
        this.sprint = sprint;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Calendar)) {
            return false;
        }
        return id != null && id.equals(((Calendar) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Calendar{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", holidays=" + getHolidays() +
            "}";
    }
}
