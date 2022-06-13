package sample.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import sample.web.rest.TestUtil;

class Abc25Test {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Abc25.class);
        Abc25 abc251 = new Abc25();
        abc251.setId(1L);
        Abc25 abc252 = new Abc25();
        abc252.setId(abc251.getId());
        assertThat(abc251).isEqualTo(abc252);
        abc252.setId(2L);
        assertThat(abc251).isNotEqualTo(abc252);
        abc251.setId(null);
        assertThat(abc251).isNotEqualTo(abc252);
    }
}
