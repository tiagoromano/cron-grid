package app;


/**
 * Classe que representa ...
 * 
 * @author Usuário de Teste
 * @version 1.0
 * @since 2018-05-25
 *
 */
 
public class RomanoLindo {

  public String id;
	public String name;
	  

	/**
	 * Construtor
	 **/
	public RomanoLindo (String id, String name){
	  
	  this.id = id;
	  this.name = name;
	  
	}
	
	public RomanoLindo (Object x){
	  
	  this.id = x.toString();
	  
	}

}
