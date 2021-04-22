package sample.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A JoinTableAbcXyz.
 */
@Entity
@Table(name = "join_table_abc_xyz")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class JoinTableAbcXyz implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "additional_column", nullable = false)
    private String additionalColumn;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "xyzs" }, allowSetters = true)
    private Abc abc;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "abcs" }, allowSetters = true)
    private Xyz xyz;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public JoinTableAbcXyz id(Long id) {
        this.id = id;
        return this;
    }

    public String getAdditionalColumn() {
        return this.additionalColumn;
    }

    public JoinTableAbcXyz additionalColumn(String additionalColumn) {
        this.additionalColumn = additionalColumn;
        return this;
    }

    public void setAdditionalColumn(String additionalColumn) {
        this.additionalColumn = additionalColumn;
    }

    public Abc getAbc() {
        return this.abc;
    }

    public JoinTableAbcXyz abc(Abc abc) {
        this.setAbc(abc);
        return this;
    }

    public void setAbc(Abc abc) {
        this.abc = abc;
    }

    public Xyz getXyz() {
        return this.xyz;
    }

    public JoinTableAbcXyz xyz(Xyz xyz) {
        this.setXyz(xyz);
        return this;
    }

    public void setXyz(Xyz xyz) {
        this.xyz = xyz;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof JoinTableAbcXyz)) {
            return false;
        }
        return id != null && id.equals(((JoinTableAbcXyz) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "JoinTableAbcXyz{" +
            "id=" + getId() +
            ", additionalColumn='" + getAdditionalColumn() + "'" +
            "}";
    }
}
