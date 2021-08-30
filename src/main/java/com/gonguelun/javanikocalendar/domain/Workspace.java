package com.gonguelun.javanikocalendar.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Workspace.
 */
@Entity
@Table(name = "workspace")
public class Workspace implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Size(min = 20)
    @Column(name = "description", nullable = false)
    private String description;

    @NotNull
    @Column(name = "is_private", nullable = false)
    private Boolean isPrivate;

    @OneToMany(mappedBy = "workspace")
    @JsonIgnoreProperties(value = { "sprints", "workspace", "usuarios" }, allowSetters = true)
    private Set<Proyect> proyects = new HashSet<>();

    @ManyToMany(mappedBy = "workspaces")
    @JsonIgnoreProperties(value = { "user", "inputs", "workspaces", "proyects" }, allowSetters = true)
    private Set<Usuario> usuarios = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Workspace id(Long id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public Workspace name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public Workspace description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getIsPrivate() {
        return this.isPrivate;
    }

    public Workspace isPrivate(Boolean isPrivate) {
        this.isPrivate = isPrivate;
        return this;
    }

    public void setIsPrivate(Boolean isPrivate) {
        this.isPrivate = isPrivate;
    }

    public Set<Proyect> getProyects() {
        return this.proyects;
    }

    public Workspace proyects(Set<Proyect> proyects) {
        this.setProyects(proyects);
        return this;
    }

    public Workspace addProyect(Proyect proyect) {
        this.proyects.add(proyect);
        proyect.setWorkspace(this);
        return this;
    }

    public Workspace removeProyect(Proyect proyect) {
        this.proyects.remove(proyect);
        proyect.setWorkspace(null);
        return this;
    }

    public void setProyects(Set<Proyect> proyects) {
        if (this.proyects != null) {
            this.proyects.forEach(i -> i.setWorkspace(null));
        }
        if (proyects != null) {
            proyects.forEach(i -> i.setWorkspace(this));
        }
        this.proyects = proyects;
    }

    public Set<Usuario> getUsuarios() {
        return this.usuarios;
    }

    public Workspace usuarios(Set<Usuario> usuarios) {
        this.setUsuarios(usuarios);
        return this;
    }

    public Workspace addUsuario(Usuario usuario) {
        this.usuarios.add(usuario);
        usuario.getWorkspaces().add(this);
        return this;
    }

    public Workspace removeUsuario(Usuario usuario) {
        this.usuarios.remove(usuario);
        usuario.getWorkspaces().remove(this);
        return this;
    }

    public void setUsuarios(Set<Usuario> usuarios) {
        if (this.usuarios != null) {
            this.usuarios.forEach(i -> i.removeWorkspace(this));
        }
        if (usuarios != null) {
            usuarios.forEach(i -> i.addWorkspace(this));
        }
        this.usuarios = usuarios;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Workspace)) {
            return false;
        }
        return id != null && id.equals(((Workspace) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Workspace{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", isPrivate='" + getIsPrivate() + "'" +
            "}";
    }
}
