package app.entity;

import java.io.*;
import javax.persistence.*;
import java.util.*;
import javax.xml.bind.annotation.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonFilter;
import cronapi.rest.security.CronappSecurity;


/**
 * Classe que representa a tabela CIDADE
 * @generated
 */
@Entity
@Table(name = "\"CIDADE\"")
@XmlRootElement
@CronappSecurity
@JsonFilter("app.entity.Cidade")
public class Cidade implements Serializable {

  /**
   * UID da classe, necessário na serialização
   * @generated
   */
  private static final long serialVersionUID = 1L;

  /**
   * @generated
   */
  @Id
  @Column(name = "id", nullable = false, insertable=true, updatable=true)
  private java.lang.String id = UUID.randomUUID().toString().toUpperCase();

  /**
  * @generated
  */
  @Column(name = "nome", nullable = true, unique = false, insertable=true, updatable=true)
  
  private java.lang.String nome;

  /**
  * @generated
  */
  @ManyToOne
  @JoinColumn(name="fk_estado", nullable = true, referencedColumnName = "id", insertable=true, updatable=true)
  
  private Estado estado;

  /**
  * @generated
  */
  @Column(name = "numero", nullable = true, unique = false, insertable=true, updatable=true)
  
  private java.lang.Integer numero;

  /**
  * @generated
  */
  @Column(name = "capital", nullable = true, unique = false, insertable=true, updatable=true)
  
  private boolean capital;

  /**
  * @generated
  */
  @Temporal(TemporalType.DATE)
  @Column(name = "data_fundacao", nullable = true, unique = false, insertable=true, updatable=true)
  
  private java.util.Date dataFundacao;

  /**
  * @generated
  */
  @Temporal(TemporalType.TIMESTAMP)
  @Column(name = "dataHora", nullable = true, unique = false, insertable=true, updatable=true)
  
  private java.util.Date dataHora;

  /**
  * @generated
  */
  @Column(name = "numeroDouble", nullable = true, unique = false, insertable=true, updatable=true)
  
  private java.lang.Double numeroDouble;

  /**
   * Construtor
   * @generated
   */
  public Cidade(){
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
  public Cidade setId(java.lang.String id){
    this.id = id;
    return this;
  }

  /**
   * Obtém nome
   * return nome
   * @generated
   */
  
  public java.lang.String getNome(){
    return this.nome;
  }

  /**
   * Define nome
   * @param nome nome
   * @generated
   */
  public Cidade setNome(java.lang.String nome){
    this.nome = nome;
    return this;
  }

  /**
   * Obtém estado
   * return estado
   * @generated
   */
  
  public Estado getEstado(){
    return this.estado;
  }

  /**
   * Define estado
   * @param estado estado
   * @generated
   */
  public Cidade setEstado(Estado estado){
    this.estado = estado;
    return this;
  }

  /**
   * Obtém numero
   * return numero
   * @generated
   */
  
  public java.lang.Integer getNumero(){
    return this.numero;
  }

  /**
   * Define numero
   * @param numero numero
   * @generated
   */
  public Cidade setNumero(java.lang.Integer numero){
    this.numero = numero;
    return this;
  }

  /**
   * Obtém capital
   * return capital
   * @generated
   */
  
  public boolean getCapital(){
    return this.capital;
  }

  /**
   * Define capital
   * @param capital capital
   * @generated
   */
  public Cidade setCapital(boolean capital){
    this.capital = capital;
    return this;
  }

  /**
   * Obtém dataFundacao
   * return dataFundacao
   * @generated
   */
  
  public java.util.Date getDataFundacao(){
    return this.dataFundacao;
  }

  /**
   * Define dataFundacao
   * @param dataFundacao dataFundacao
   * @generated
   */
  public Cidade setDataFundacao(java.util.Date dataFundacao){
    this.dataFundacao = dataFundacao;
    return this;
  }

  /**
   * Obtém dataHora
   * return dataHora
   * @generated
   */
  
  public java.util.Date getDataHora(){
    return this.dataHora;
  }

  /**
   * Define dataHora
   * @param dataHora dataHora
   * @generated
   */
  public Cidade setDataHora(java.util.Date dataHora){
    this.dataHora = dataHora;
    return this;
  }

  /**
   * Obtém numeroDouble
   * return numeroDouble
   * @generated
   */
  
  public java.lang.Double getNumeroDouble(){
    return this.numeroDouble;
  }

  /**
   * Define numeroDouble
   * @param numeroDouble numeroDouble
   * @generated
   */
  public Cidade setNumeroDouble(java.lang.Double numeroDouble){
    this.numeroDouble = numeroDouble;
    return this;
  }

  /**
   * @generated
   */
  @Override
  public boolean equals(Object obj) {
    if (this == obj) return true;
    if (obj == null || getClass() != obj.getClass()) return false;
    Cidade object = (Cidade)obj;
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
