package com.gonguelun.javanikocalendar.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.gonguelun.javanikocalendar.config.Constants;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

/**
 * A Usuario.
 */
@Entity
@Table(name = "usuario")
public class Usuario implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Pattern(regexp = Constants.LOGIN_REGEX)
    @Size(min = 1, max = 50)
    @Column(name = "username", length = 50, unique = true, nullable = false)
    private String username;

    @NotNull
    @Size(min = 5, max = 60)
    @Column(name = "password", length = 60, nullable = false)
    private String password;

    @Email
    @Size(min = 5, max = 254)
    @Column(length = 254, unique = true)
    private String email;

    @Column(name = "birthdate")
    private LocalDate birthdate;

    @Column(name = "phone")
    private Integer phone;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    @OneToMany(mappedBy = "usuario")
    @JsonIgnoreProperties(value = { "usuario", "sprint" }, allowSetters = true)
    private Set<Input> inputs = new HashSet<>();

    @ManyToMany(mappedBy = "usuarios")
    @JsonIgnoreProperties(value = { "proyects", "usuarios" }, allowSetters = true)
    private Set<Workspace> workspaces = new HashSet<>();

    @ManyToMany(mappedBy = "usuarios")
    @JsonIgnoreProperties(value = { "sprints", "workspace", "usuarios" }, allowSetters = true)
    private Set<Proyect> proyects = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Usuario id(Long id) {
        this.id = id;
        return this;
    }

    public String getUsername() {
        return this.username;
    }

    public Usuario username(String username) {
        this.username = username;
        return this;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return this.password;
    }

    public Usuario password(String password) {
        this.password = password;
        return this;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return this.email;
    }

    public Usuario email(String email) {
        this.email = email;
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDate getBirthdate() {
        return this.birthdate;
    }

    public Usuario birthdate(LocalDate birthdate) {
        this.birthdate = birthdate;
        return this;
    }

    public void setBirthdate(LocalDate birthdate) {
        this.birthdate = birthdate;
    }

    public Integer getPhone() {
        return this.phone;
    }

    public Usuario phone(Integer phone) {
        this.phone = phone;
        return this;
    }

    public void setPhone(Integer phone) {
        this.phone = phone;
    }

    public User getUser() {
        return this.user;
    }

    public Usuario user(User user) {
        this.setUser(user);
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Set<Input> getInputs() {
        return this.inputs;
    }

    public Usuario inputs(Set<Input> inputs) {
        this.setInputs(inputs);
        return this;
    }

    public Usuario addInput(Input input) {
        this.inputs.add(input);
        input.setUsuario(this);
        return this;
    }

    public Usuario removeInput(Input input) {
        this.inputs.remove(input);
        input.setUsuario(null);
        return this;
    }

    public void setInputs(Set<Input> inputs) {
        if (this.inputs != null) {
            this.inputs.forEach(i -> i.setUsuario(null));
        }
        if (inputs != null) {
            inputs.forEach(i -> i.setUsuario(this));
        }
        this.inputs = inputs;
    }

    public Set<Workspace> getWorkspaces() {
        return this.workspaces;
    }

    public Usuario workspaces(Set<Workspace> workspaces) {
        this.setWorkspaces(workspaces);
        return this;
    }

    public Usuario addWorkspace(Workspace workspace) {
        this.workspaces.add(workspace);
        workspace.getUsuarios().add(this);
        return this;
    }

    public Usuario removeWorkspace(Workspace workspace) {
        this.workspaces.remove(workspace);
        workspace.getUsuarios().remove(this);
        return this;
    }

    public void setWorkspaces(Set<Workspace> workspaces) {
        if (this.workspaces != null) {
            this.workspaces.forEach(i -> i.removeUsuario(this));
        }
        if (workspaces != null) {
            workspaces.forEach(i -> i.addUsuario(this));
        }
        this.workspaces = workspaces;
    }

    public Set<Proyect> getProyects() {
        return this.proyects;
    }

    public Usuario proyects(Set<Proyect> proyects) {
        this.setProyects(proyects);
        return this;
    }

    public Usuario addProyect(Proyect proyect) {
        this.proyects.add(proyect);
        proyect.getUsuarios().add(this);
        return this;
    }

    public Usuario removeProyect(Proyect proyect) {
        this.proyects.remove(proyect);
        proyect.getUsuarios().remove(this);
        return this;
    }

    public void setProyects(Set<Proyect> proyects) {
        if (this.proyects != null) {
            this.proyects.forEach(i -> i.removeUsuario(this));
        }
        if (proyects != null) {
            proyects.forEach(i -> i.addUsuario(this));
        }
        this.proyects = proyects;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Usuario)) {
            return false;
        }
        return id != null && id.equals(((Usuario) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Usuario{" +
            "id=" + getId() +
            ", username=" + getUsername() +
            ", password=" + getPassword() +
            ", email=" + getEmail() +
            ", birthdate='" + getBirthdate() + "'" +
            ", phone=" + getPhone() +
            "}";
    }
}
