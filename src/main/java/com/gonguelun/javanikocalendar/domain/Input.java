package com.gonguelun.javanikocalendar.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Input.
 */
@Entity
@Table(name = "input")
public class Input implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "comment")
    private String comment;

    @NotNull
    @Column(name = "feelings", nullable = false)
    private Integer feelings;

    @NotNull
    @Column(name = "input_date", nullable = false, unique = true)
    private LocalDate inputDate;

    @ManyToOne
    @JsonIgnoreProperties(value = { "user", "inputs", "workspaces", "proyects" }, allowSetters = true)
    private Usuario usuario;

    @ManyToOne
    @JsonIgnoreProperties(value = { "inputs", "proyect" }, allowSetters = true)
    private Sprint sprint;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Input id(Long id) {
        this.id = id;
        return this;
    }

    public String getComment() {
        return this.comment;
    }

    public Input comment(String comment) {
        this.comment = comment;
        return this;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Integer getFeelings() {
        return this.feelings;
    }

    public Input feelings(Integer feelings) {
        this.feelings = feelings;
        return this;
    }

    public void setFeelings(Integer feelings) {
        this.feelings = feelings;
    }

    public LocalDate getInputDate() {
        return this.inputDate;
    }

    public Input inputDate(LocalDate inputDate) {
        this.inputDate = inputDate;
        return this;
    }

    public void setInputDate(LocalDate inputDate) {
        this.inputDate = inputDate;
    }

    public Usuario getUsuario() {
        return this.usuario;
    }

    public Input usuario(Usuario usuario) {
        this.setUsuario(usuario);
        return this;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Sprint getSprint() {
        return this.sprint;
    }

    public Input sprint(Sprint sprint) {
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
        if (!(o instanceof Input)) {
            return false;
        }
        return id != null && id.equals(((Input) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Input{" +
            "id=" + getId() +
            ", comment='" + getComment() + "'" +
            ", feelings=" + getFeelings() +
            ", inputDate='" + getInputDate() + "'" +
            "}";
    }
}
