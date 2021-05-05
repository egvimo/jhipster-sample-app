package sample.domain;

import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Abc.
 */
@Entity
@Table(name = "abc")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Abc implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @Size(min = 4, max = 4)
    @Column(name = "my_field_with_validation", length = 4)
    private String myFieldWithValidation;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Abc id(Long id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public Abc name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMyFieldWithValidation() {
        return this.myFieldWithValidation;
    }

    public Abc myFieldWithValidation(String myFieldWithValidation) {
        this.myFieldWithValidation = myFieldWithValidation;
        return this;
    }

    public void setMyFieldWithValidation(String myFieldWithValidation) {
        this.myFieldWithValidation = myFieldWithValidation;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Abc)) {
            return false;
        }
        return id != null && id.equals(((Abc) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Abc{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", myFieldWithValidation='" + getMyFieldWithValidation() + "'" +
            "}";
    }
}
