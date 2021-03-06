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

    @Column(name = "title")
    private String title;

    @Column(name = "created_at")
    private LocalDate createdAt;

    @Column(name = "due_on")
    private LocalDate dueOn;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @Column(name = "description")
    private String description;

    @OneToMany(mappedBy = "sprint")
    @JsonIgnoreProperties(value = { "usuario", "sprint" }, allowSetters = true)
    private Set<Input> inputs = new HashSet<>();

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

    public String getTitle() {
        return this.title;
    }

    public Sprint title(String title) {
        this.title = title;
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public LocalDate getCreatedAt() {
        return this.createdAt;
    }

    public Sprint createdAt(LocalDate createdAt) {
        this.createdAt = createdAt;
        return this;
    }

    public void setCreatedAt(LocalDate createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDate getDueOn() {
        return this.dueOn;
    }

    public Sprint dueOn(LocalDate dueOn) {
        this.dueOn = dueOn;
        return this;
    }

    public void setDueOn(LocalDate dueOn) {
        this.dueOn = dueOn;
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

    public String getDescription() {
        return this.description;
    }

    public Sprint description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<Input> getInputs() {
        return this.inputs;
    }

    public Sprint inputs(Set<Input> inputs) {
        this.setInputs(inputs);
        return this;
    }

    public Sprint addInput(Input input) {
        this.inputs.add(input);
        input.setSprint(this);
        return this;
    }

    public Sprint removeInput(Input input) {
        this.inputs.remove(input);
        input.setSprint(null);
        return this;
    }

    public void setInputs(Set<Input> inputs) {
        if (this.inputs != null) {
            this.inputs.forEach(i -> i.setSprint(null));
        }
        if (inputs != null) {
            inputs.forEach(i -> i.setSprint(this));
        }
        this.inputs = inputs;
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
            ", title='" + getTitle() + "'" +
            ", createdAt='" + getCreatedAt() + "'" +
            ", dueOn='" + getDueOn() + "'" +
            ", status='" + getStatus() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}

