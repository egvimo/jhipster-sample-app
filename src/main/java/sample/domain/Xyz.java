package sample.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
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
    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @OneToMany(mappedBy = "xyz")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "abc", "xyz" }, allowSetters = true)
    private Set<JoinTable> abcs = new HashSet<>();

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

    public String getName() {
        return this.name;
    }

    public Xyz name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<JoinTable> getAbcs() {
        return this.abcs;
    }

    public Xyz abcs(Set<JoinTable> joinTables) {
        this.setAbcs(joinTables);
        return this;
    }

    public Xyz addAbc(JoinTable joinTable) {
        this.abcs.add(joinTable);
        joinTable.setXyz(this);
        return this;
    }

    public Xyz removeAbc(JoinTable joinTable) {
        this.abcs.remove(joinTable);
        joinTable.setXyz(null);
        return this;
    }

    public void setAbcs(Set<JoinTable> joinTables) {
        if (this.abcs != null) {
            this.abcs.forEach(i -> i.setXyz(null));
        }
        if (joinTables != null) {
            joinTables.forEach(i -> i.setXyz(this));
        }
        this.abcs = joinTables;
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
            ", name='" + getName() + "'" +
            "}";
    }
}
