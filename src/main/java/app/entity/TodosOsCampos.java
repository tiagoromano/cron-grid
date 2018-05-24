package app.entity;

import java.io.*;
import javax.persistence.*;
import java.util.*;
import javax.xml.bind.annotation.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonFilter;
import cronapi.rest.security.CronappSecurity;


/**
 * Classe que representa a tabela TODOSOSCAMPOS
 * @generated
 */
@Entity
@Table(name = "\"TODOSOSCAMPOS\"")
@XmlRootElement
@CronappSecurity
@JsonFilter("app.entity.TodosOsCampos")
public class TodosOsCampos implements Serializable {

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
  @Column(name = "xInteger", nullable = true, unique = false, insertable=true, updatable=true)
  
  private java.lang.Integer xinteger;

  /**
  * @generated
  */
  @Column(name = "xLong", nullable = true, unique = false, insertable=true, updatable=true)
  
  private java.lang.Long xlong;

  /**
  * @generated
  */
  @Column(name = "xCharacter", nullable = true, unique = false, insertable=true, updatable=true)
  
  private java.lang.Character xcharacter;

  /**
  * @generated
  */
  @Column(name = "xDouble", nullable = true, unique = false, insertable=true, updatable=true)
  
  private java.lang.Double xdouble;

  /**
  * @generated
  */
  @Temporal(TemporalType.TIME)
  @Column(name = "xTime", nullable = true, unique = false, insertable=true, updatable=true)
  
  private java.util.Date xtime;

  /**
  * @generated
  */
  @Temporal(TemporalType.TIMESTAMP)
  @Column(name = "xTimeStamp", nullable = true, unique = false, insertable=true, updatable=true)
  
  private java.util.Date xtimeStamp;

  /**
  * @generated
  */
  @Temporal(TemporalType.DATE)
  @Column(name = "xDate", nullable = true, unique = false, insertable=true, updatable=true)
  
  private java.util.Date xdate;

  /**
  * @generated
  */
  @Column(name = "xBoolean", nullable = true, unique = false, insertable=true, updatable=true)
  
  private java.lang.Boolean xboolean;

  /**
  * @generated
  */
  @Column(name = "xUUID", nullable = true, unique = false, insertable=true, updatable=true)
  
  private java.util.UUID xuUID;

  /**
  * @generated
  */
  @Column(name = "xint2", nullable = true, unique = false, insertable=true, updatable=true)
  
  private int xint2;

  /**
  * @generated
  */
  @Column(name = "xfloat2", nullable = true, unique = false, insertable=true, updatable=true)
  
  private float xfloat2;

  /**
  * @generated
  */
  @Column(name = "xfloat22", nullable = true, unique = false, insertable=true, updatable=true)
  
  private float xfloat22;

  /**
  * @generated
  */
  @Column(name = "xdouble2", nullable = true, unique = false, insertable=true, updatable=true)
  
  private double xdouble2;

  /**
  * @generated
  */
  @Column(name = "xboolean2", nullable = true, unique = false, insertable=true, updatable=true)
  
  private boolean xboolean2;

  /**
  * @generated
  */
  @Column(name = "xlong2", nullable = true, unique = false, insertable=true, updatable=true)
  
  private long xlong2;

  /**
  * @generated
  */
  @Column(name = "xBigDecimal", nullable = true, unique = false, insertable=true, updatable=true)
  
  private java.math.BigDecimal xbigDecimal;

  /**
   * Construtor
   * @generated
   */
  public TodosOsCampos(){
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
  public TodosOsCampos setId(java.lang.String id){
    this.id = id;
    return this;
  }

  /**
   * Obtém xinteger
   * return xinteger
   * @generated
   */
  
  public java.lang.Integer getXinteger(){
    return this.xinteger;
  }

  /**
   * Define xinteger
   * @param xinteger xinteger
   * @generated
   */
  public TodosOsCampos setXinteger(java.lang.Integer xinteger){
    this.xinteger = xinteger;
    return this;
  }

  /**
   * Obtém xlong
   * return xlong
   * @generated
   */
  
  public java.lang.Long getXlong(){
    return this.xlong;
  }

  /**
   * Define xlong
   * @param xlong xlong
   * @generated
   */
  public TodosOsCampos setXlong(java.lang.Long xlong){
    this.xlong = xlong;
    return this;
  }

  /**
   * Obtém xcharacter
   * return xcharacter
   * @generated
   */
  
  public java.lang.Character getXcharacter(){
    return this.xcharacter;
  }

  /**
   * Define xcharacter
   * @param xcharacter xcharacter
   * @generated
   */
  public TodosOsCampos setXcharacter(java.lang.Character xcharacter){
    this.xcharacter = xcharacter;
    return this;
  }

  /**
   * Obtém xdouble
   * return xdouble
   * @generated
   */
  
  public java.lang.Double getXdouble(){
    return this.xdouble;
  }

  /**
   * Define xdouble
   * @param xdouble xdouble
   * @generated
   */
  public TodosOsCampos setXdouble(java.lang.Double xdouble){
    this.xdouble = xdouble;
    return this;
  }

  /**
   * Obtém xtime
   * return xtime
   * @generated
   */
  
  public java.util.Date getXtime(){
    return this.xtime;
  }

  /**
   * Define xtime
   * @param xtime xtime
   * @generated
   */
  public TodosOsCampos setXtime(java.util.Date xtime){
    this.xtime = xtime;
    return this;
  }

  /**
   * Obtém xtimeStamp
   * return xtimeStamp
   * @generated
   */
  
  public java.util.Date getXtimeStamp(){
    return this.xtimeStamp;
  }

  /**
   * Define xtimeStamp
   * @param xtimeStamp xtimeStamp
   * @generated
   */
  public TodosOsCampos setXtimeStamp(java.util.Date xtimeStamp){
    this.xtimeStamp = xtimeStamp;
    return this;
  }

  /**
   * Obtém xdate
   * return xdate
   * @generated
   */
  
  public java.util.Date getXdate(){
    return this.xdate;
  }

  /**
   * Define xdate
   * @param xdate xdate
   * @generated
   */
  public TodosOsCampos setXdate(java.util.Date xdate){
    this.xdate = xdate;
    return this;
  }

  /**
   * Obtém xboolean
   * return xboolean
   * @generated
   */
  
  public java.lang.Boolean getXboolean(){
    return this.xboolean;
  }

  /**
   * Define xboolean
   * @param xboolean xboolean
   * @generated
   */
  public TodosOsCampos setXboolean(java.lang.Boolean xboolean){
    this.xboolean = xboolean;
    return this;
  }

  /**
   * Obtém xuUID
   * return xuUID
   * @generated
   */
  
  public java.util.UUID getXuUID(){
    return this.xuUID;
  }

  /**
   * Define xuUID
   * @param xuUID xuUID
   * @generated
   */
  public TodosOsCampos setXuUID(java.util.UUID xuUID){
    this.xuUID = xuUID;
    return this;
  }

  /**
   * Obtém xint2
   * return xint2
   * @generated
   */
  
  public int getXint2(){
    return this.xint2;
  }

  /**
   * Define xint2
   * @param xint2 xint2
   * @generated
   */
  public TodosOsCampos setXint2(int xint2){
    this.xint2 = xint2;
    return this;
  }

  /**
   * Obtém xfloat2
   * return xfloat2
   * @generated
   */
  
  public float getXfloat2(){
    return this.xfloat2;
  }

  /**
   * Define xfloat2
   * @param xfloat2 xfloat2
   * @generated
   */
  public TodosOsCampos setXfloat2(float xfloat2){
    this.xfloat2 = xfloat2;
    return this;
  }

  /**
   * Obtém xfloat22
   * return xfloat22
   * @generated
   */
  
  public float getXfloat22(){
    return this.xfloat22;
  }

  /**
   * Define xfloat22
   * @param xfloat22 xfloat22
   * @generated
   */
  public TodosOsCampos setXfloat22(float xfloat22){
    this.xfloat22 = xfloat22;
    return this;
  }

  /**
   * Obtém xdouble2
   * return xdouble2
   * @generated
   */
  
  public double getXdouble2(){
    return this.xdouble2;
  }

  /**
   * Define xdouble2
   * @param xdouble2 xdouble2
   * @generated
   */
  public TodosOsCampos setXdouble2(double xdouble2){
    this.xdouble2 = xdouble2;
    return this;
  }

  /**
   * Obtém xboolean2
   * return xboolean2
   * @generated
   */
  
  public boolean getXboolean2(){
    return this.xboolean2;
  }

  /**
   * Define xboolean2
   * @param xboolean2 xboolean2
   * @generated
   */
  public TodosOsCampos setXboolean2(boolean xboolean2){
    this.xboolean2 = xboolean2;
    return this;
  }

  /**
   * Obtém xlong2
   * return xlong2
   * @generated
   */
  
  public long getXlong2(){
    return this.xlong2;
  }

  /**
   * Define xlong2
   * @param xlong2 xlong2
   * @generated
   */
  public TodosOsCampos setXlong2(long xlong2){
    this.xlong2 = xlong2;
    return this;
  }

  /**
   * Obtém xbigDecimal
   * return xbigDecimal
   * @generated
   */
  
  public java.math.BigDecimal getXbigDecimal(){
    return this.xbigDecimal;
  }

  /**
   * Define xbigDecimal
   * @param xbigDecimal xbigDecimal
   * @generated
   */
  public TodosOsCampos setXbigDecimal(java.math.BigDecimal xbigDecimal){
    this.xbigDecimal = xbigDecimal;
    return this;
  }

  /**
   * @generated
   */
  @Override
  public boolean equals(Object obj) {
    if (this == obj) return true;
    if (obj == null || getClass() != obj.getClass()) return false;
    TodosOsCampos object = (TodosOsCampos)obj;
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
