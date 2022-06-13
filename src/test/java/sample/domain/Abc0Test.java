package sample.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import sample.web.rest.TestUtil;

class Abc0Test {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Abc0.class);
        Abc0 abc01 = new Abc0();
        abc01.setId(1L);
        Abc0 abc02 = new Abc0();
        abc02.setId(abc01.getId());
        assertThat(abc01).isEqualTo(abc02);
        abc02.setId(2L);
        assertThat(abc01).isNotEqualTo(abc02);
        abc01.setId(null);
        assertThat(abc01).isNotEqualTo(abc02);
    }
}
