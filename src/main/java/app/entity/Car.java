package app.entity;

import java.io.*;
import javax.persistence.*;
import java.util.*;
import javax.xml.bind.annotation.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonFilter;
import cronapi.rest.security.CronappSecurity;


/**
 * Classe que representa a tabela CAR
 * @generated
 */
@Entity
@Table(name = "\"CAR\"")
@XmlRootElement
@CronappSecurity
@JsonFilter("app.entity.Car")
public class Car implements Serializable {

  /**
   * UID da classe, necessário na serialização
   * @generated
   */
  private static final long serialVersionUID = 1L;

  /**
   * @generated
   */
  @Id
  @Column(name = "Id", nullable = false, insertable=true, updatable=true)
  private java.lang.String id = UUID.randomUUID().toString().toUpperCase();

  /**
  * @generated
  */
  @Column(name = "Model", nullable = true, unique = false, insertable=true, updatable=true)
  
  private java.lang.String model;

  /**
  * @generated
  */
  @Column(name = "Price", nullable = true, unique = false, insertable=true, updatable=true)
  
  private java.lang.String price;

  /**
  * @generated
  */
  @Column(name = "ModelYear", nullable = true, unique = false, insertable=true, updatable=true)
  
  private java.lang.Integer modelYear;

  /**
  * @generated
  */
  @Temporal(TemporalType.TIMESTAMP)
  @Column(name = "Updated", nullable = true, unique = false, insertable=true, updatable=true)
  
  private java.util.Date updated;

  /**
   * Construtor
   * @generated
   */
  public Car(){
  }


  /**
   * Obtém id
   * return id
   * @generated
   */
  
  public java.lang.String getId(){
    return this.id;
  }

  /**
   * Define id
   * @param id id
   * @generated
   */
  public Car setId(java.lang.String id){
    this.id = id;
    return this;
  }

  /**
   * Obtém model
   * return model
   * @generated
   */
  
  public java.lang.String getModel(){
    return this.model;
  }

  /**
   * Define model
   * @param model model
   * @generated
   */
  public Car setModel(java.lang.String model){
    this.model = model;
    return this;
  }

  /**
   * Obtém price
   * return price
   * @generated
   */
  
  public java.lang.String getPrice(){
    return this.price;
  }

  /**
   * Define price
   * @param price price
   * @generated
   */
  public Car setPrice(java.lang.String price){
    this.price = price;
    return this;
  }

  /**
   * Obtém modelYear
   * return modelYear
   * @generated
   */
  
  public java.lang.Integer getModelYear(){
    return this.modelYear;
  }

  /**
   * Define modelYear
   * @param modelYear modelYear
   * @generated
   */
  public Car setModelYear(java.lang.Integer modelYear){
    this.modelYear = modelYear;
    return this;
  }

  /**
   * Obtém updated
   * return updated
   * @generated
   */
  
  public java.util.Date getUpdated(){
    return this.updated;
  }

  /**
   * Define updated
   * @param updated updated
   * @generated
   */
  public Car setUpdated(java.util.Date updated){
    this.updated = updated;
    return this;
  }

  /**
   * @generated
   */
  @Override
  public boolean equals(Object obj) {
    if (this == obj) return true;
    if (obj == null || getClass() != obj.getClass()) return false;
    Car object = (Car)obj;
    if (id != null ? !id.equals(object.id) : object.id != null) return false;
    return true;
  }

  /**
   * @generated
   */
  @Override
  public int hashCode() {
    int result = 1;
    result = 31 * result + ((id == null) ? 0 : id.hashCode());
    return result;
  }

}
