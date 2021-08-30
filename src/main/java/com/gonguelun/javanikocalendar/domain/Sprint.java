package com.gonguelun.javanikocalendar.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.gonguelun.javanikocalendar.domain.enumeration.Status;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Sprint.
 */
@Entity
@Table(name = "sprint")
public class Sprint implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sprint")
    private Integer sprint;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @Column(name = "goal")
    private String goal;

    @OneToMany(mappedBy = "sprint")
    @JsonIgnoreProperties(value = { "inputs", "sprint" }, allowSetters = true)
    private Set<Calendar> calendars = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "sprints", "workspace", "usuarios" }, allowSetters = true)
    private Proyect proyect;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Sprint id(Long id) {
        this.id = id;
        return this;
    }

    public Integer getSprint() {
        return this.sprint;
    }

    public Sprint sprint(Integer sprint) {
        this.sprint = sprint;
        return this;
    }

    public void setSprint(Integer sprint) {
        this.sprint = sprint;
    }

    public LocalDate getStartDate() {
        return this.startDate;
    }

    public Sprint startDate(LocalDate startDate) {
        this.startDate = startDate;
        return this;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return this.endDate;
    }

    public Sprint endDate(LocalDate endDate) {
        this.endDate = endDate;
        return this;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Status getStatus() {
        return this.status;
    }

    public Sprint status(Status status) {
        this.status = status;
        return this;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public String getGoal() {
        return this.goal;
    }

    public Sprint goal(String goal) {
        this.goal = goal;
        return this;
    }

    public void setGoal(String goal) {
        this.goal = goal;
    }

    public Set<Calendar> getCalendars() {
        return this.calendars;
    }

    public Sprint calendars(Set<Calendar> calendars) {
        this.setCalendars(calendars);
        return this;
    }

    public Sprint addCalendar(Calendar calendar) {
        this.calendars.add(calendar);
        calendar.setSprint(this);
        return this;
    }

    public Sprint removeCalendar(Calendar calendar) {
        this.calendars.remove(calendar);
        calendar.setSprint(null);
        return this;
    }

    public void setCalendars(Set<Calendar> calendars) {
        if (this.calendars != null) {
            this.calendars.forEach(i -> i.setSprint(null));
        }
        if (calendars != null) {
            calendars.forEach(i -> i.setSprint(this));
        }
        this.calendars = calendars;
    }

    public Proyect getProyect() {
        return this.proyect;
    }

    public Sprint proyect(Proyect proyect) {
        this.setProyect(proyect);
        return this;
    }

    public void setProyect(Proyect proyect) {
        this.proyect = proyect;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Sprint)) {
            return false;
        }
        return id != null && id.equals(((Sprint) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Sprint{" +
            "id=" + getId() +
            ", sprint=" + getSprint() +
            ", startDate='" + getStartDate() + "'" +
            ", endDate='" + getEndDate() + "'" +
            ", status='" + getStatus() + "'" +
            ", goal='" + getGoal() + "'" +
            "}";
    }
}
