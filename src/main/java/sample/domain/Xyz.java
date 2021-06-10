package sample.domain;

import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Xyz.
 */
@Entity
@Table(name = "xyz")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Xyz implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "unique_field", nullable = false, unique = true)
    private String uniqueField;

    @Column(name = "another_field")
    private String anotherField;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Xyz id(Long id) {
        this.id = id;
        return this;
    }

    public String getUniqueField() {
        return this.uniqueField;
    }

    public Xyz uniqueField(String uniqueField) {
        this.uniqueField = uniqueField;
        return this;
    }

    public void setUniqueField(String uniqueField) {
        this.uniqueField = uniqueField;
    }

    public String getAnotherField() {
        return this.anotherField;
    }

    public Xyz anotherField(String anotherField) {
        this.anotherField = anotherField;
        return this;
    }

    public void setAnotherField(String anotherField) {
        this.anotherField = anotherField;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Xyz)) {
            return false;
        }
        return id != null && id.equals(((Xyz) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Xyz{" +
            "id=" + getId() +
            ", uniqueField='" + getUniqueField() + "'" +
            ", anotherField='" + getAnotherField() + "'" +
            "}";
    }
}
