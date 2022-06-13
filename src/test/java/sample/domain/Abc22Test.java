package sample.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import sample.web.rest.TestUtil;

class Abc22Test {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Abc22.class);
        Abc22 abc221 = new Abc22();
        abc221.setId(1L);
        Abc22 abc222 = new Abc22();
        abc222.setId(abc221.getId());
        assertThat(abc221).isEqualTo(abc222);
        abc222.setId(2L);
        assertThat(abc221).isNotEqualTo(abc222);
        abc221.setId(null);
        assertThat(abc221).isNotEqualTo(abc222);
    }
}
