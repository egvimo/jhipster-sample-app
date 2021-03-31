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

    @OneToMany(mappedBy = "parent")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "parent" }, allowSetters = true)
    private Set<Xyz> children = new HashSet<>();

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

    public Set<Xyz> getChildren() {
        return this.children;
    }

    public Abc children(Set<Xyz> xyzs) {
        this.setChildren(xyzs);
        return this;
    }

    public Abc addChildren(Xyz xyz) {
        this.children.add(xyz);
        xyz.setParent(this);
        return this;
    }

    public Abc removeChildren(Xyz xyz) {
        this.children.remove(xyz);
        xyz.setParent(null);
        return this;
    }

    public void setChildren(Set<Xyz> xyzs) {
        if (this.children != null) {
            this.children.forEach(i -> i.setParent(null));
        }
        if (xyzs != null) {
            xyzs.forEach(i -> i.setParent(this));
        }
        this.children = xyzs;
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
            "}";
    }
}