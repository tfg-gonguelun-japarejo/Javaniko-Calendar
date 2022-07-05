package com.gonguelun.javanikocalendar.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Proyect.
 */
@Entity
@Table(name = "proyect")
public class Proyect implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "created_at")
    private LocalDate createdAt;

    @NotNull
    @Column(name = "is_private", nullable = false)
    private Boolean isPrivate;

    @Column(name = "milestones_url")
    private String milestonesUrl;

    @OneToMany(mappedBy = "proyect")
    @JsonIgnoreProperties(value = { "calendars", "proyect" }, allowSetters = true)
    private Set<Sprint> sprints = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "proyects", "usuarios" }, allowSetters = true)
    private Workspace workspace;

    @ManyToMany
    @JoinTable(
        name = "rel_proyect__usuario",
        joinColumns = @JoinColumn(name = "proyect_id"),
        inverseJoinColumns = @JoinColumn(name = "usuario_id")
    )
    @JsonIgnoreProperties(value = { "user", "inputs", "workspaces", "proyects" }, allowSetters = true)
    private Set<Usuario> usuarios = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Proyect id(Long id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public Proyect name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public Proyect description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getCreatedAt() {
        return this.createdAt;
    }

    public Proyect createdAt(LocalDate createdAt) {
        this.createdAt = createdAt;
        return this;
    }

    public void setCreatedAt(LocalDate createdAt) {
        this.createdAt = createdAt;
    }

    public Boolean getIsPrivate() {
        return this.isPrivate;
    }

    public Proyect isPrivate(Boolean isPrivate) {
        this.isPrivate = isPrivate;
        return this;
    }

    public void setIsPrivate(Boolean isPrivate) {
        this.isPrivate = isPrivate;
    }

    public String getMilestonesUrl() {
        return this.milestonesUrl;
    }

    public Proyect milestonesUrl(String milestonesUrl) {
        this.milestonesUrl = milestonesUrl;
        return this;
    }

    public void setMilestonesUrl(String milestonesUrl) {
        this.milestonesUrl = milestonesUrl;
    }

    public Set<Sprint> getSprints() {
        return this.sprints;
    }

    public Proyect sprints(Set<Sprint> sprints) {
        this.setSprints(sprints);
        return this;
    }

    public Proyect addSprint(Sprint sprint) {
        this.sprints.add(sprint);
        sprint.setProyect(this);
        return this;
    }

    public Proyect removeSprint(Sprint sprint) {
        this.sprints.remove(sprint);
        sprint.setProyect(null);
        return this;
    }

    public void setSprints(Set<Sprint> sprints) {
        if (this.sprints != null) {
            this.sprints.forEach(i -> i.setProyect(null));
        }
        if (sprints != null) {
            sprints.forEach(i -> i.setProyect(this));
        }
        this.sprints = sprints;
    }

    public Workspace getWorkspace() {
        return this.workspace;
    }

    public Proyect workspace(Workspace workspace) {
        this.setWorkspace(workspace);
        return this;
    }

    public void setWorkspace(Workspace workspace) {
        this.workspace = workspace;
    }

    public Set<Usuario> getUsuarios() {
        return this.usuarios;
    }

    public Proyect usuarios(Set<Usuario> usuarios) {
        this.setUsuarios(usuarios);
        return this;
    }

    public Proyect addUsuario(Usuario usuario) {
        this.usuarios.add(usuario);
        usuario.getProyects().add(this);
        return this;
    }

    public Proyect removeUsuario(Usuario usuario) {
        this.usuarios.remove(usuario);
        usuario.getProyects().remove(this);
        return this;
    }

    public void setUsuarios(Set<Usuario> usuarios) {
        this.usuarios = usuarios;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Proyect)) {
            return false;
        }
        return id != null && id.equals(((Proyect) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Proyect{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", createdAt='" + getCreatedAt() + "'" +
            ", isPrivate='" + getIsPrivate() + "'" +
            ", milestonesUrl='" + getMilestonesUrl() + "'" +
            "}";
    }
}
