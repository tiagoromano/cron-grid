package blockly;

import cronapi.*;
import cronapi.rest.security.CronappSecurity;
import java.util.concurrent.Callable;

@CronapiMetaData(type = "blockly")
@CronappSecurity
public class Bloco {

	public static final int TIMEOUT = 300;

	/**
	 *
	 * @param Dados
	 * @param param2
	 * @param param3
	 * @return Var
	 */
	// Bloco
	public static Var Executar(Var Dados, Var param2, Var param3) throws Exception {
		return new Callable<Var>() {

			public Var call() throws Exception {
				return Var.VAR_NULL;
			}
		}.call();
	}

}
