package sample.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import sample.web.rest.TestUtil;

class Abc24Test {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Abc24.class);
        Abc24 abc241 = new Abc24();
        abc241.setId(1L);
        Abc24 abc242 = new Abc24();
        abc242.setId(abc241.getId());
        assertThat(abc241).isEqualTo(abc242);
        abc242.setId(2L);
        assertThat(abc241).isNotEqualTo(abc242);
        abc241.setId(null);
        assertThat(abc241).isNotEqualTo(abc242);
    }
}
