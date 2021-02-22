package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;

/**
 * A SparePart.
 */
@Entity
@Table(name = "spare_part")
@org.springframework.data.elasticsearch.annotations.Document(indexName = "sparepart")
public class SparePart implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "term")
    private String term;

    @Column(name = "price")
    private Integer price;

    @Column(name = "note")
    private String note;

    @OneToOne(mappedBy = "sparePart")
    @JsonIgnore
    private Delivery delivery;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public SparePart name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTerm() {
        return term;
    }

    public SparePart term(String term) {
        this.term = term;
        return this;
    }

    public void setTerm(String term) {
        this.term = term;
    }

    public Integer getPrice() {
        return price;
    }

    public SparePart price(Integer price) {
        this.price = price;
        return this;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public String getNote() {
        return note;
    }

    public SparePart note(String note) {
        this.note = note;
        return this;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public Delivery getDelivery() {
        return delivery;
    }

    public SparePart delivery(Delivery delivery) {
        this.delivery = delivery;
        return this;
    }

    public void setDelivery(Delivery delivery) {
        this.delivery = delivery;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SparePart)) {
            return false;
        }
        return id != null && id.equals(((SparePart) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SparePart{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", term='" + getTerm() + "'" +
            ", price=" + getPrice() +
            ", note='" + getNote() + "'" +
            "}";
    }
}
